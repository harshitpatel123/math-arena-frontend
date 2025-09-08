import dynamic from 'next/dynamic';

const GameClient = dynamic(() => import('../../../components/GameClient'));

export default function GamePage({ params }) {
  return <GameClient gameId={params.gameId} />;
}
