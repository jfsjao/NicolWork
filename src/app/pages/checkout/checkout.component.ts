import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService, PaidPlanSlug } from '@core/api.service';
import { AuthService } from '@core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

interface CheckoutPlanView {
  slug: PaidPlanSlug;
  name: string;
  price: number;
  eyebrow: string;
  description: string;
  features: string[];
}

interface CheckoutUpsellOption {
  slug: PaidPlanSlug;
  name: string;
  price: number;
  extraAmount: number;
}

const PLAN_RANK: Record<string, number> = {
  gratuito: 0,
  basic: 1,
  pro: 2,
  premium: 3
};

const PLAN_PRICES: Record<string, number> = {
  gratuito: 0,
  basic: 29.9,
  pro: 65.9,
  premium: 97.9
};

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);

  isLoading = false;
  errorMessage: string | null = null;

  readonly plans: Record<PaidPlanSlug, CheckoutPlanView> = {
    basic: {
      slug: 'basic',
      name: 'Basic',
      price: 29.9,
      eyebrow: 'Entrada paga',
      description: 'Primeira camada paga para desbloquear os packs essenciais.',
      features: ['Packs essenciais', 'Atualizacoes mensais', 'Acesso vitalicio']
    },
    pro: {
      slug: 'pro',
      name: 'Pro',
      price: 65.9,
      eyebrow: 'Mais escolhido',
      description: 'Mais packs, presets e materiais para produzir com mais ritmo.',
      features: ['Tudo do Basic', 'Biblioteca maior', 'Suporte prioritario']
    },
    premium: {
      slug: 'premium',
      name: 'Premium',
      price: 97.9,
      eyebrow: 'Completo',
      description: 'Acesso completo para usar todos os packs e extras disponiveis.',
      features: ['Tudo do Pro', 'Todos os packs', 'Conteudos premium']
    }
  };

  get selectedPlan(): CheckoutPlanView | null {
    const plan = this.route.snapshot.queryParamMap.get('plan');

    if (plan === 'basic' || plan === 'pro' || plan === 'premium') {
      return this.plans[plan];
    }

    return null;
  }

  get currentPlanSlug(): string {
    return this.authService.currentUser()?.plano ?? 'gratuito';
  }

  get currentPlanName(): string {
    const names: Record<string, string> = {
      gratuito: 'Gratuito',
      basic: 'Basic',
      pro: 'Pro',
      premium: 'Premium'
    };

    return names[this.currentPlanSlug] ?? 'Gratuito';
  }

  get currentPlanPrice(): number {
    return PLAN_PRICES[this.currentPlanSlug] ?? 0;
  }

  get chargedAmount(): number {
    const plan = this.selectedPlan;

    if (!plan) {
      return 0;
    }

    return Math.max(plan.price - this.currentPlanPrice, 0);
  }

  get isUpgrade(): boolean {
    return this.currentPlanSlug !== 'gratuito' && this.currentPlanPrice > 0;
  }

  get canCheckout(): boolean {
    const plan = this.selectedPlan;

    if (!plan) {
      return false;
    }

    return (PLAN_RANK[this.currentPlanSlug] ?? 0) < PLAN_RANK[plan.slug];
  }

  get upsellOptions(): CheckoutUpsellOption[] {
    const plan = this.selectedPlan;

    if (!plan || plan.slug === 'premium') {
      return [];
    }

    return (['pro', 'premium'] as PaidPlanSlug[])
      .filter((slug) => (PLAN_RANK[slug] ?? 0) > (PLAN_RANK[plan.slug] ?? 0))
      .map((slug) => ({
        slug,
        name: this.plans[slug].name,
        price: this.plans[slug].price,
        extraAmount: Math.max(this.plans[slug].price - plan.price, 0)
      }));
  }

  async startCheckout(): Promise<void> {
    const plan = this.selectedPlan;

    if (!plan) {
      await this.router.navigate(['/plans']);
      return;
    }

    if (!this.canCheckout) {
      this.errorMessage = 'Seu plano atual ja e igual ou superior ao plano selecionado.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const checkout = await firstValueFrom(this.apiService.createCheckout(plan.slug));
      const checkoutUrl = checkout.checkoutUrl || checkout.sandboxCheckoutUrl;

      if (!checkoutUrl) {
        throw new Error('CHECKOUT_URL_NOT_FOUND');
      }

      if (isPlatformBrowser(this.platformId)) {
        window.location.href = checkoutUrl;
      }
    } catch (error: any) {
      const message =
        error?.error?.message || 'Nao foi possivel iniciar o pagamento. Tente novamente.';
      this.errorMessage = message;
      this.toastr.error(message, 'Pagamento');
    } finally {
      this.isLoading = false;
    }
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}
