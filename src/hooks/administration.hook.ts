import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { IExpenses } from '@/interfaces/adminitration.interface';
import { ExportDashboard } from '@/interfaces/invoice.interface';
import { getExpenses } from '@/services/expenses.service';
import { formatDateOnly } from './formaters';

interface UseAdministrationReturn {
	expenses: IExpenses | null;
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	error: unknown;
	refetch: () => void;
}

interface AdministrationQueryFilter {
	startDate: string;
	endDate: string;
	type: string;
}

const buildAdministrationFilter = (filtersDate: ExportDashboard): AdministrationQueryFilter => ({
	startDate: formatDateOnly(filtersDate.startDate),
	endDate: formatDateOnly(filtersDate.endDate),
	type: filtersDate.type,
});

const buildAdministrationPayload = (filter: AdministrationQueryFilter): ExportDashboard => ({
	startDate: new Date(filter.startDate),
	endDate: new Date(filter.endDate),
	type: filter.type,
});

export const useAdministration = (filtersDate: ExportDashboard): UseAdministrationReturn => {
	const filter = buildAdministrationFilter(filtersDate);

	const query = useQuery({
		queryKey: [
			'administration-expenses',
			filter.startDate,
			filter.endDate,
			filter.type,
		],
		queryFn: async () => {
			const response = await getExpenses(buildAdministrationPayload(filter)) as IExpenses;
			return response;
		},
		enabled: Boolean(filter.startDate && filter.endDate && filter.type),
		staleTime: 5 * 60 * 1000,
		gcTime: 15 * 60 * 1000,
		placeholderData: keepPreviousData,
		refetchOnWindowFocus: false,
	});

	return {
		expenses: query.data ?? null,
		isLoading: query.isLoading,
		isFetching: query.isFetching,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
