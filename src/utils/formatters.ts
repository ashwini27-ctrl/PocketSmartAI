export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getCategoryTheme(planType: string) {
  switch (planType) {
    case 'home':
      return {
        name: 'Home Planning',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200',
        iconColor: 'text-emerald-600',
        accentBg: 'bg-emerald-600',
      };
    case 'party':
      return {
        name: 'Party Planning',
        badgeBg: 'bg-violet-50',
        badgeText: 'text-violet-700',
        badgeBorder: 'border-violet-200',
        iconColor: 'text-violet-600',
        accentBg: 'bg-violet-600',
      };
    case 'jewelry':
      return {
        name: 'Jewelry Planning',
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-200',
        iconColor: 'text-amber-600',
        accentBg: 'bg-amber-600',
      };
    default:
      return {
        name: 'Smart Plan',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200',
        iconColor: 'text-blue-600',
        accentBg: 'bg-blue-600',
      };
  }
}
