import { NextRequest, NextResponse } from 'next/server';
import { session } from '@/app/neo4j';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: 'É necessário fornecer o ID da pessoa.', status: 400 });
    }

    try {
      await session.run('MATCH (p:Person {id: $id}) DETACH DELETE p', { id });
      return NextResponse.json({ message: 'Pessoa removida com sucesso.', status: 200 });
    } catch (error) {
      return NextResponse.json({
        error: 'Falha em remover pessoa.\nErro: ' + error,
        status: 500,
      });
    }
  }