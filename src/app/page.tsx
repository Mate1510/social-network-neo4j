"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Person {
  id: string;
  name: string;
  age: number;
  location: string;
}

const Home = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [persons, setPersons] = useState<Person[]>([]);
  const [friendshipPersonId1, setFriendshipPersonId1] = useState("");
  const [friendshipPersonId2, setFriendshipPersonId2] = useState("");
  const [removeFriendId, setRemoveFriendId] = useState("");

  // Carregar lista de pessoas ao carregar a página
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/pessoas");
        setPersons(response.data);
      } catch (error) {
        console.error("Erro ao carregar pessoas:", error);
      }
    }

    fetchData();
  }, []);

  // Adicionar uma pessoa
  const addPerson = async () => {
    try {
      await axios.post("/api/pessoas", {
        name,
        age,
        location,
      });

      // Atualizar lista de pessoas após adicionar uma nova
      const response = await axios.get("/api/pessoas");
      setPersons(response.data);

      // Limpar os campos após adicionar
      setName("");
      setAge("");
      setLocation("");
    } catch (error) {
      console.error("Erro ao adicionar pessoa:", error);
    }
  };

  // Criar relação de amizade
  const addFriendship = async () => {
    try {
      await axios.post("/api/amizades", {
        personId1: friendshipPersonId1,
        personId2: friendshipPersonId2,
      });

      // Limpar os campos após criar a amizade
      setFriendshipPersonId1("");
      setFriendshipPersonId2("");
    } catch (error) {
      console.error("Erro ao criar amizade:", error);
    }
  };

  // Remover uma pessoa de suas relações
  const removeFriend = async () => {
    try {
      await axios.delete(`/api/pessoas/${removeFriendId}`);

      // Atualizar lista de pessoas após remover
      const response = await axios.get("/api/pessoas");
      setPersons(response.data);

      // Limpar o campo após remover
      setRemoveFriendId("");
    } catch (error) {
      console.error("Erro ao remover pessoa:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">Adicionar Pessoa</h1>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Idade"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Localização"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={addPerson}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold my-4">Lista de Pessoas</h2>
        <ul className="flex gap-5 flex-wrap">
          {Array.isArray(persons) &&
            persons.map((person) => (
              <li
                key={person.id}
                className="mb-4 border border-blue-500 rounded-lg p-5 flex flex-col gap-2"
              >
                <div>
                  <strong>ID:</strong> {person.id}
                </div>
                <div>
                  <strong>Nome:</strong> {person.name}
                </div>
                <div>
                  <strong>Idade:</strong> {person.age}
                </div>
                <div>
                  <strong>Localização:</strong> {person.location}
                </div>
                <div>
                  <button
                    onClick={() => setRemoveFriendId(person.id)}
                    className="p-2 bg-red-500 text-white rounded mr-2"
                  >
                    Remover da lista
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold my-4">Criar Relação de Amizade</h2>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="ID Pessoa 1"
            value={friendshipPersonId1}
            onChange={(e) => setFriendshipPersonId1(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="ID Pessoa 2"
            value={friendshipPersonId2}
            onChange={(e) => setFriendshipPersonId2(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={addFriendship}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Criar Amizade
          </button>
        </div>

        <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="ID Pessoa"
          value={removeFriendId}
          onChange={(e) => setRemoveFriendId(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={removeFriend}
          className="p-2 bg-red-500 text-white rounded"
        >
          Remover Amizade
        </button>
      </div>
      </div>
    </div>
  );
};

export default Home;
