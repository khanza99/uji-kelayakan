import { PAYMENT_STATUS } from '@/utils/constants';
import Badge from '@/components/ui/Badge';

export default function PaymentStatusBadge({ status }) {
  const config = PAYMENT_STATUS[status] || { label: status, color: 'gray' };
  return <Badge color={config.color} dot size="sm">{config.label}</Badge>;
}
