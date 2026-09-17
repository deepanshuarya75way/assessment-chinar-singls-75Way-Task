import { Chip } from '@mui/material';
import { STATUS_COLORS, STATUS_LABELS } from '../../data/mockData';

export default function StatusChip({ status }) {
  if (!status) return null;
  return (
    <Chip
      label={STATUS_LABELS[status] ?? status}
      color={STATUS_COLORS[status] ?? 'default'}
      size="small"
      sx={{ fontWeight: 700, fontSize: '0.72rem', letterSpacing: 0.3 }}
    />
  );
}
