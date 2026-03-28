import { TreinosPlanejados } from './TreinosPlanejados';
import { TreinusDataState } from './TreinusDataState';

export default async function DashboardPage() {
  return (
    <div>
      <TreinusDataState />
      <TreinosPlanejados />
    </div>
  );
}
