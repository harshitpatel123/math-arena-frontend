import dynamic from 'next/dynamic';

const GameClient = dynamic(() => import('../../../components/GameClient'));

export default async function GamePage({ params }) {
  const { gameId } = await params;
  return <GameClient gameId={gameId} />;
}
