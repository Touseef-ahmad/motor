import { Request, Response } from 'express';
import { CarDetails, OilChange, FuelLog, Expense } from '../models';

export const getCarDetails = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const car = await CarDetails.findByPk(carId, {
      include: [
        { model: OilChange, as: 'oilChanges' },
        { model: FuelLog, as: 'fuelLogs' },
        { model: Expense, as: 'expenses' },
      ],
    });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    console.error('Error fetching car details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await CarDetails.findAll();
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCar = async (req: Request, res: Response) => {
  try {
    const car = await CarDetails.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const car = await CarDetails.findByPk(carId);

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    await car.update(req.body);
    res.json(car);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const car = await CarDetails.findByPk(carId);

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    await car.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
