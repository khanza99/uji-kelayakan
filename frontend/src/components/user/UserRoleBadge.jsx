import { USER_ROLES } from '@/utils/constants';
import Badge from '@/components/ui/Badge';

export default function UserRoleBadge({ role }) {
  const config = USER_ROLES[role] || { label: role, color: 'gray' };
  return <Badge color={config.color} size="sm">{config.label}</Badge>;
}
