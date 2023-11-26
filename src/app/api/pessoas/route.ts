import { NextRequest, NextResponse } from 'next/server';
import { session } from '@/app/neo4j';

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json({ error: 'Estão faltando dados.', status: 400 });
  }

  const { name, age, location } = await req.json();

  if (!name || !age || !location) {
    return NextResponse.json({ error: 'Todos os campos são obrigatórios.', status: 400 });
  }

  const personId = Math.random().toString(36).substring(7);

  try {
    const result = await session.run(
      'CREATE (p:Person {id: $personId, name: $name, age: $age, location: $location}) RETURN p',
      { personId, name, age: parseInt(age), location }
    );


    const createdPerson = result.records[0].get('p').properties;
    return NextResponse.json(createdPerson, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      error: 'Falha em criar pessoa.\nErro: ' + error,
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const result = await session.run('MATCH (p:Person) RETURN p');
    const persons = result.records.map(record => record.get('p').properties);
    return NextResponse.json(persons, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: 'Falha em listar pessoas.\nErro: ' + error,
      status: 500,
    });
  }
}
