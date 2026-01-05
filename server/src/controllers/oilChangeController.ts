import { Request, Response } from 'express';
import { OilChange } from '../models';

export const getOilChanges = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const oilChanges = await OilChange.findAll({
      where: { carId },
      order: [['date', 'DESC']],
    });
    res.json(oilChanges);
  } catch (error) {
    console.error('Error fetching oil changes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createOilChange = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const oilChange = await OilChange.create({
      ...req.body,
      carId,
    });
    res.status(201).json(oilChange);
  } catch (error) {
    console.error('Error creating oil change:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteOilChange = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const oilChange = await OilChange.findByPk(id);

    if (!oilChange) {
      return res.status(404).json({ error: 'Oil change not found' });
    }

    await oilChange.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting oil change:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
