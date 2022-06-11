/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const { data } = await api.get('/foods');
      setFoods(data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const foodData: Omit<IFoodPlate, 'id'> = {
        ...food,
        available: true,
      };

      api.post('/foods', foodData).then(({ data }) => {
        setFoods(oldFoods => [...oldFoods, data]);
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'available'>,
  ): Promise<void> {
    try {
      const { id, name, image, price, description } = food;

      const foodData: Omit<IFoodPlate, 'id'> = {
        name,
        image,
        price,
        description,
        available: true,
      };

      api.put(`/foods/${id}`, foodData).then(({ data }) => {
        const tmpFoods = foods.filter(f => f.id !== id);
        setFoods([...tmpFoods, data]);
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    api.delete(`/foods/${id}`).then(() => {
      const tmpFoods = foods.filter(food => food.id !== id);
      setFoods(tmpFoods);
    });
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
