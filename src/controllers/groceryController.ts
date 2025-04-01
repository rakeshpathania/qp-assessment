import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES, SUCCESS_CREATED_STATUS, SUCCESS_STATUS } from '../utils/errorHandlers.js';
import { GroceryItemService } from '../services/groceryItemService.js';
import { AppDataSource } from '../database/dataSource.js';

const groceryItemService = new GroceryItemService(AppDataSource);


const addGroceryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, price, quantityInStock } = req.body;
        const newItem = await groceryItemService.addGroceryItem({
            name,
            price: Number(price),
            quantityInStock: Number(quantityInStock)
        });

        res.status(STATUS_CODES.CREATED).json(
            SUCCESS_CREATED_STATUS("Grocery item added successfully", newItem)
        );
    } catch (error) {
        next(error);
    }
};

const getGroceryItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { skip, take } = req.query;
        
        const safeSkip = parseInt(skip as string, 10) || 0;
        const safeTake = parseInt(take as string, 10) || 10; 

        const items = await groceryItemService.getAllGroceryItems(safeSkip, safeTake);
        res.status(STATUS_CODES.OK).json(SUCCESS_STATUS("Grocery items fetched successfully", items));
    } catch (error) {
        next(error);
    }
};

const removeGroceryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const itemId = parseInt(req.params.id, 10);
        await groceryItemService.removeGroceryItem(itemId);
        res.status(STATUS_CODES.OK).json(SUCCESS_STATUS("Grocery item removed successfully"));
    } catch (error) {
        next(error);
    }
};

const updateGroceryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const itemId = parseInt(req.params.id, 10);
        const { name, price } = req.body;
        
        const updateData = {
            ...(name && { name }),
            ...(price !== undefined && { price: Number(price) })
        };

        const updatedItem = await groceryItemService.updateGroceryItem(itemId, updateData);
        res.status(STATUS_CODES.OK).json(SUCCESS_STATUS("Grocery item updated successfully", updatedItem));
    } catch (error) {
        next(error);
    }
};

const updateInventoryLevel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const itemId = parseInt(req.params.id, 10);
        const { quantityInStock } = req.body;

        const updatedItem = await groceryItemService.updateInventory(
            itemId,
            Math.max(0, Number(quantityInStock))
        );
        res.status(STATUS_CODES.OK).json(
            SUCCESS_STATUS("Inventory level updated successfully", updatedItem)
        );
    } catch (error) {
        next(error);
    }
};

const getAvailableGroceryItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const items = await groceryItemService.getAvailableGroceryItems();
        res.status(STATUS_CODES.OK).json(SUCCESS_STATUS("Available grocery items fetched successfully", items));
    } catch (error) {
        next(error);
    }
};


export const groceryController = {
    addGroceryItem,
    getGroceryItems,
    removeGroceryItem,
    updateGroceryItem,
    updateInventoryLevel,
    getAvailableGroceryItems
};

export default groceryController;
