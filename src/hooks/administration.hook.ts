import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { IExpenses } from '@/interfaces/adminitration.interface';
import { DateRangeFilter } from '@/interfaces/invoice.interface';
import { getExpenses } from '@/services/expenses.service';

interface UseAdministrationReturn {
	expenses: IExpenses | null;
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	error: unknown;
	refetch: () => void;
}

export const useAdministration = (filtersDate: DateRangeFilter): UseAdministrationReturn => {
	const query = useQuery({
		queryKey: [
			'administration-expenses',
			new Date(filtersDate.startDate)?.getTime?.() ?? 0,
			new Date(filtersDate.endDate)?.getTime?.() ?? 0,
		],
		queryFn: async () => {
			const response = await getExpenses(filtersDate) as IExpenses;
			return response;
		},
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
