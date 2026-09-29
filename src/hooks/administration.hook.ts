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

// formatDateOnly entrega 'YYYY-MM-DD' y new Date('YYYY-MM-DD') se interpreta como
// medianoche UTC, por lo que las facturas del propio día final quedaban excluidas.
// Se construye la fecha en local: inicio del día para el desde y fin del día para el hasta.
const parseDateOnly = (value: string): Date => {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, (month ?? 1) - 1, day ?? 1);
};

const endOfDay = (date: Date): Date => {
	const result = new Date(date);
	result.setHours(23, 59, 59, 999);
	return result;
};

const buildAdministrationPayload = (filter: AdministrationQueryFilter): ExportDashboard => ({
	startDate: parseDateOnly(filter.startDate),
	endDate: endOfDay(parseDateOnly(filter.endDate)),
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
