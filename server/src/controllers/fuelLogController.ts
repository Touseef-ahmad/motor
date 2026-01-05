import { Request, Response } from 'express';
import { FuelLog } from '../models';
import { Op } from 'sequelize';

export const getFuelLogs = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const fuelLogs = await FuelLog.findAll({
      where: { carId },
      order: [['date', 'DESC']],
    });
    res.json(fuelLogs);
  } catch (error) {
    console.error('Error fetching fuel logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createFuelLog = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const fuelLog = await FuelLog.create({
      ...req.body,
      carId,
    });
    res.status(201).json(fuelLog);
  } catch (error) {
    console.error('Error creating fuel log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteFuelLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fuelLog = await FuelLog.findByPk(id);

    if (!fuelLog) {
      return res.status(404).json({ error: 'Fuel log not found' });
    }

    await fuelLog.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting fuel log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFuelAverage = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const fuelLogs = await FuelLog.findAll({
      where: { carId },
      order: [['mileage', 'ASC']],
    });

    if (fuelLogs.length < 2) {
      return res.json({ average: 0 });
    }

    let totalDistance = 0;
    let totalFuel = 0;

    for (let i = 1; i < fuelLogs.length; i++) {
      const distance = fuelLogs[i].mileage - fuelLogs[i - 1].mileage;
      if (distance > 0) {
        totalDistance += distance;
        totalFuel += fuelLogs[i].liters;
      }
    }

    const average = totalFuel > 0 ? totalDistance / totalFuel : 0;
    res.json({ average });
  } catch (error) {
    console.error('Error calculating fuel average:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
