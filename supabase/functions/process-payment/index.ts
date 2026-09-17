import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrderItem {
  game_id: string;
  title: string;
  price: number;
  qty: number;
}

interface ProcessPaymentRequest {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: ProcessPaymentRequest = await req.json();

    // Validate required fields
    if (!body.customer_name?.trim()) {
      return new Response(
        JSON.stringify({ error: "Le nom du client est requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!body.customer_phone?.trim() || body.customer_phone.trim().length < 8) {
      return new Response(
        JSON.stringify({ error: "Un numéro de téléphone valide est requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!body.items || body.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Le panier est vide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // All payments are routed to Wave — the payment_method from the client
    // is recorded for the customer's reference, but the merchant account
    // receiving all revenue is Wave.
    const waveAccount = "Wave - Boutique de Desteur Game";

    // Create Supabase client with service role to write the order
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch game download URLs for all items in the cart
    const gameIds = body.items.map((item) => item.game_id);
    const { data: games, error: gamesError } = await supabase
      .from("games")
      .select("id, title, download_url, price, stock")
      .in("id", gameIds);

    if (gamesError) {
      return new Response(
        JSON.stringify({ error: "Erreur lors de la récupération des jeux" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Verify prices match what the client sent (prevent tampering)
    const gameMap = new Map(games.map((g) => [g.id, g]));
    let verifiedTotal = 0;
    for (const item of body.items) {
      const game = gameMap.get(item.game_id);
      if (!game) {
        return new Response(
          JSON.stringify({ error: `Jeu introuvable: ${item.title}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (game.stock <= 0) {
        return new Response(
          JSON.stringify({ error: `Rupture de stock: ${item.title}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      verifiedTotal += game.price * item.qty;
    }

    // Use server-calculated total (not client-sent) for security
    const finalTotal = verifiedTotal;

    // Insert the order with status 'paid'
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: body.customer_name.trim(),
        customer_phone: body.customer_phone.trim(),
        customer_email: body.customer_email?.trim() || null,
        items: body.items,
        total: finalTotal,
        payment_method: body.payment_method,
        status: "paid",
      })
      .select("id")
      .single();

    if (orderError) {
      return new Response(
        JSON.stringify({ error: "Erreur lors de l'enregistrement de la commande" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Build download links for each purchased game
    const downloads = body.items.map((item) => {
      const game = gameMap.get(item.game_id);
      return {
        title: item.title,
        download_url: game?.download_url || null,
        quantity: item.qty,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        total: finalTotal,
        payment_routed_to: waveAccount,
        downloads,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Erreur interne du serveur" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
