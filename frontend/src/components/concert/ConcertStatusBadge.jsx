import { CONCERT_STATUS } from '@/utils/constants';
import Badge from '@/components/ui/Badge';

export default function ConcertStatusBadge({ status }) {
  const config = CONCERT_STATUS[status] || CONCERT_STATUS.draft;
  return (
    <Badge color={config.color} dot size="sm">
      {config.label}
    </Badge>
  );
}
