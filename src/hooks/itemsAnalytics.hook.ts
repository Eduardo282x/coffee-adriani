import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import { ExportDashboard } from '@/interfaces/invoice.interface';
import { ItemsAnalyticsResponse } from '@/interfaces/itemsAnalytics.interface';
import { getPaymentItemsAnalytics } from '@/services/payment.service';

interface UseItemsAnalyticsOptions {
	dateRange?: DateRange;
	productType: string;
}

interface ItemsAnalyticsQueryFilter {
	startDate: string;
	endDate: string;
	type: string;
}

const EMPTY_ITEMS_ANALYTICS: ItemsAnalyticsResponse = {
	type: '',
	startDate: '',
	endDate: '',
	totals: {
		totalItems: 0,
		totalAmount: 0,
		totalInvoices: 0,
		totalPayments: 0,
	},
	generalItems: {
		totalItems: 0,
		totalAmount: 0,
		detailItems: [],
	},
	daily: [],
	invoices: [],
};

const buildItemsAnalyticsFilter = (dateRange: DateRange | undefined, productType: string): ItemsAnalyticsQueryFilter => ({
	startDate: dateRange?.from ? new Date(dateRange.from as Date).toString() : '',
	endDate: dateRange?.to ? new Date(dateRange.to as Date).toString() : '',
	type: productType,
});

const hasValidFilter = (filter: ItemsAnalyticsQueryFilter) => Boolean(filter.startDate && filter.endDate && filter.type);

const buildItemsAnalyticsPayload = (filter: ItemsAnalyticsQueryFilter): ExportDashboard => ({
	startDate: filter.startDate,
	endDate: filter.endDate,
	type: filter.type,
});

export const itemsAnalyticsQueryKeys = {
	all: ['items-analytics'] as const,
	main: (filter: ItemsAnalyticsQueryFilter) => ['items-analytics', 'main', filter] as const,
};

export const useItemsAnalytics = ({ dateRange, productType }: UseItemsAnalyticsOptions) => {
	const filter = buildItemsAnalyticsFilter(dateRange, productType);
	const enabled = hasValidFilter(filter);

	const {
		data,
		isLoading,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: itemsAnalyticsQueryKeys.main(filter),
		queryFn: async () => getPaymentItemsAnalytics(buildItemsAnalyticsPayload(filter)) as Promise<ItemsAnalyticsResponse>,
		enabled,
		staleTime: 5 * 60 * 1000,
	});

	return {
		itemsAnalytics: data ?? EMPTY_ITEMS_ANALYTICS,
		isLoading,
		isFetching,
		refetch,
		filter,
	};
};