import { NextRequest, NextResponse } from "next/server";
import { session } from "@/app/neo4j";

export async function POST(req: NextRequest) {
  const { personId1, personId2 } = await req.json();

  if (!personId1 || !personId2) {
    return NextResponse.json({
      error: "IDs das pessoas são necessários.",
      status: 400,
    });
  }

  try {
    await session.run(
      "MATCH (p1:Person {id: $personId1}), (p2:Person {id: $personId2}) MERGE (p1)-[:AMIGO_DE]->(p2)",
      { personId1, personId2 }
    );

    return NextResponse.json({
      message: "Relação de amizade adicionada com sucesso.",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Falha em adicionar relação de amizade.\nErro: " + error,
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  const personId = req.nextUrl.searchParams.get("personId");

  if (!personId) {
    return NextResponse.json({
      error: "É necessário fornecer o ID da pessoa.",
      status: 400,
    });
  }

  try {
    const result = await session.run(
      "MATCH (p:Person {id: $personId})-[:AMIGO_DE*]-(friend) RETURN friend",
      { personId }
    );

    const friends = result.records.map(
      (record) => record.get("friend").properties
    );
    return NextResponse.json(friends, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Falha em visualizar rede de amizades.\nErro: " + error,
      status: 500,
    });
  }
}
