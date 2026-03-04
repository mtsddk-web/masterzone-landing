/**
 * PayU REST API Client for Poland
 * Docs: https://developers.payu.com/en/restapi.html
 */

interface PayUConfig {
  posId: string;
  clientId: string;
  clientSecret: string;
  merchantId: string;
  environment: 'sandbox' | 'production';
}

interface PayUOrder {
  notifyUrl: string;
  continueUrl: string;
  customerIp: string;
  merchantPosId: string;
  description: string;
  currencyCode: string;
  totalAmount: string; // w groszach
  buyer?: {
    email: string;
    firstName?: string;
    lastName?: string;
    language?: string;
  };
  products: Array<{
    name: string;
    unitPrice: string; // w groszach
    quantity: string;
  }>;
  payMethods?: {
    payMethod: {
      type: 'CARD_TOKEN' | 'PBL'; // PBL = pay-by-link (BLIK, Przelewy24, karty)
      value?: string; // token dla recurring
    };
  };
}

interface PayUOrderResponse {
  status: {
    statusCode: string;
  };
  redirectUri?: string;
  orderId?: string;
}

interface PayUTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  grant_type: string;
}

class PayUClient {
  private config: PayUConfig;
  private baseUrl: string;
  private tokenCache: { token: string; expiresAt: number } | null = null;

  constructor(config: PayUConfig) {
    this.config = config;
    this.baseUrl =
      config.environment === 'production'
        ? 'https://secure.payu.com/api/v2_1'
        : 'https://secure.snd.payu.com/api/v2_1';
  }

  /**
   * Pobiera OAuth token (cache na 3600s)
   */
  private async getAccessToken(): Promise<string> {
    // Sprawdź cache
    if (this.tokenCache && this.tokenCache.expiresAt > Date.now()) {
      return this.tokenCache.token;
    }

    // Pobierz nowy token
    const authUrl =
      this.config.environment === 'production'
        ? 'https://secure.payu.com/pl/standard/user/oauth/authorize'
        : 'https://secure.snd.payu.com/pl/standard/user/oauth/authorize';

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`PayU OAuth failed: ${response.status} ${await response.text()}`);
    }

    const data: PayUTokenResponse = await response.json();

    // Cache token (expires_in - 60s buffer)
    this.tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    return data.access_token;
  }

  /**
   * Tworzy nowe zamówienie (payment link)
   */
  async createOrder(order: PayUOrder): Promise<PayUOrderResponse> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PayU createOrder error:', errorText);
      throw new Error(`PayU createOrder failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Pobiera status zamówienia
   */
  async getOrder(orderId: string): Promise<any> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`PayU getOrder failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Anuluje zamówienie
   */
  async cancelOrder(orderId: string): Promise<void> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`PayU cancelOrder failed: ${response.status}`);
    }
  }

  /**
   * Zwrot płatności (refund)
   */
  async refundOrder(orderId: string, description: string, amount?: string): Promise<any> {
    const token = await this.getAccessToken();

    const body: any = { description };
    if (amount) {
      body.amount = amount;
    }

    const response = await fetch(`${this.baseUrl}/orders/${orderId}/refunds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`PayU refund failed: ${response.status}`);
    }

    return response.json();
  }
}

// Singleton instance
let _payuClient: PayUClient | null = null;

export function getPayU(): PayUClient {
  if (!_payuClient) {
    const posId = process.env.PAYU_POS_ID;
    const clientId = process.env.PAYU_CLIENT_ID;
    const clientSecret = process.env.PAYU_CLIENT_SECRET;
    const environment = (process.env.PAYU_ENVIRONMENT || 'production') as 'sandbox' | 'production';

    if (!posId || !clientId || !clientSecret) {
      throw new Error('PayU credentials not configured in environment variables');
    }

    const merchantId = process.env.PAYU_MERCHANT_ID || posId; // merchant_id = pos_id dla większości przypadków

    _payuClient = new PayUClient({
      posId,
      clientId,
      clientSecret,
      merchantId,
      environment,
    });
  }

  return _payuClient;
}

export type { PayUOrder, PayUOrderResponse };
