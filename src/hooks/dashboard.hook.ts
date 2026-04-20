import { useCallback } from 'react';
import { keepPreviousData, QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import { ClientDemand, IDashboard } from '@/interfaces/dashboard.interface';
import { ExportDashboard } from '@/interfaces/invoice.interface';
import { getDashboard, getDashboardClientDemand, getDashboardReport } from '@/services/dashboard.service';

interface UseDashboardOptions {
	dateRange?: DateRange;
	productType: string;
}

interface DashboardQueryFilter {
	startDate: string;
	endDate: string;
	type: string;
}

const EMPTY_DASHBOARD: IDashboard = {
	invoices: {
		total: 0,
		totalClients: 0,
		payed: { amount: 0, percent: 0 },
		expired: { amount: 0, percent: 0 },
		pending: { amount: 0, percent: 0 },
	},
	inventory: {
		products: [],
		lowStock: [],
	},
	lastPending: [],
};

const EMPTY_BUCKETS = {
	'1-10': [],
	'11-20': [],
	'21-30': [],
	'31-40': [],
	'41-50': [],
	'51-60': [],
	'61-70': [],
	'71-80': [],
	'81-90': [],
	'91-100': [],
	'101+': [],
};

const EMPTY_CLIENT_DEMAND: ClientDemand = {
	topClients: [],
	buckets: EMPTY_BUCKETS,
	summary: [],
	totalInvoices: 0,
};

const formatDateOnly = (value: Date | string | null | undefined): string => {
	if (!value) return '';

	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return '';

	return date.toISOString().slice(0, 10);
};

const buildDashboardFilter = (dateRange: DateRange | undefined, productType: string): DashboardQueryFilter => ({
	startDate: formatDateOnly(dateRange?.from),
	endDate: formatDateOnly(dateRange?.to),
	type: productType,
});

const buildDashboardPayload = (filter: DashboardQueryFilter): ExportDashboard => ({
	startDate: new Date(filter.startDate),
	endDate: new Date(filter.endDate),
	type: filter.type,
});

const buildDashboardClientDemandPayload = (filter: DashboardQueryFilter): ExportDashboard => ({
	startDate: filter.startDate,
	endDate: filter.endDate,
	type: filter.type,
});

const hasValidFilter = (filter: DashboardQueryFilter) => Boolean(filter.startDate && filter.endDate && filter.type);

export const dashboardQueryKeys = {
	all: ['dashboard'] as const,
	summary: (filter: DashboardQueryFilter) => ['dashboard', 'summary', filter] as const,
	clientDemand: (filter: DashboardQueryFilter) => ['dashboard', 'client-demand', filter] as const,
};

export const invalidateDashboardQueries = async (queryClient: QueryClient) => {
	await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
};

export const useDashboard = ({ dateRange, productType }: UseDashboardOptions) => {
	const filter = buildDashboardFilter(dateRange, productType);
	const enabled = hasValidFilter(filter);

	const {
		data: dashboardData,
		isLoading: isLoadingDashboard,
		isFetching: isFetchingDashboard,
		refetch: refetchDashboard,
	} = useQuery({
		queryKey: dashboardQueryKeys.summary(filter),
		queryFn: async () => getDashboard(buildDashboardPayload(filter)) as Promise<IDashboard>,
		enabled,
		placeholderData: keepPreviousData,
		staleTime: 5 * 60 * 1000,
	});

	const {
		data: clientDemandData,
		isLoading: isLoadingClientDemand,
		isFetching: isFetchingClientDemand,
		refetch: refetchClientDemand,
	} = useQuery({
		queryKey: dashboardQueryKeys.clientDemand(filter),
		queryFn: async () => getDashboardClientDemand(buildDashboardClientDemandPayload(filter)) as Promise<ClientDemand>,
		enabled,
		placeholderData: keepPreviousData,
		staleTime: 5 * 60 * 1000,
	});

	const exportDashboardMutation = useMutation({
		mutationFn: async (currentFilter: DashboardQueryFilter) => {
			return getDashboardReport(buildDashboardPayload(currentFilter)) as Promise<Blob>;
		},
	});

	const exportDashboard = useCallback(async () => {
		if (!enabled) return null;

		return exportDashboardMutation.mutateAsync(filter);
	}, [enabled, exportDashboardMutation, filter]);

	return {
		dashboardData: dashboardData ?? EMPTY_DASHBOARD,
		clientDemandData: clientDemandData ?? EMPTY_CLIENT_DEMAND,
		isLoading: isLoadingDashboard || isLoadingClientDemand,
		isFetching: isFetchingDashboard || isFetchingClientDemand,
		isLoadingDashboard,
		isLoadingClientDemand,
		isExporting: exportDashboardMutation.isPending,
		exportDashboard,
		refetchDashboard,
		refetchClientDemand,
		filter,
	};
};
