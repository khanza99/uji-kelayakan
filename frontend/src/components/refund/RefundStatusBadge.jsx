import { REFUND_STATUS } from '@/utils/constants';
import Badge from '@/components/ui/Badge';

export default function RefundStatusBadge({ status }) {
  const config = REFUND_STATUS[status] || { label: status, color: 'gray' };
  return <Badge color={config.color} dot size="sm">{config.label}</Badge>;
}
