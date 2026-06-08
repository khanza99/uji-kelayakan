import { TICKET_STATUS } from '@/utils/constants';
import Badge from '@/components/ui/Badge';

export default function TicketStatusBadge({ status }) {
  const config = TICKET_STATUS[status] || { label: status, color: 'gray' };
  return <Badge color={config.color} dot size="sm">{config.label}</Badge>;
}
