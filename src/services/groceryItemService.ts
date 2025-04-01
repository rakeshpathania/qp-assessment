import { Repository, DataSource, MoreThan } from "typeorm";
import { GroceryItem } from "../database/entities/groceryItem.js";
import { BadRequestError, NotFoundError } from "../utils/errorHandlers.js";
export class GroceryItemService {
    private readonly groceryItemRepo: Repository<GroceryItem>;

    constructor(private dataSource: DataSource) {
        this.groceryItemRepo = this.dataSource.getRepository(GroceryItem);
    }

    // Add new grocery item
    async addGroceryItem(itemData: { name: string; price: number; quantityInStock: number }): Promise<GroceryItem> {
        try {
            const newItem = this.groceryItemRepo.create(itemData);
            return await this.groceryItemRepo.save(newItem);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new BadRequestError(`Error adding grocery item: ${error.message}`);
            } else if (typeof error === 'string') {
                throw new BadRequestError(`Error adding grocery item: ${error}`);
            } else {
                throw new BadRequestError('Error adding grocery item: Unknown error occurred');
            }
        }
    }

    // Get all grocery items with optional pagination
    async getAllGroceryItems(skip = 0, take = 50): Promise<{ items: GroceryItem[]; total: number }> {
        try {
            const [items, total] = await this.groceryItemRepo.findAndCount({
                skip,
                take,
                order: { name: 'ASC' }
            });
            return { items, total };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new BadRequestError(`Error fetching grocery items: ${error.message}`);
            } else if (typeof error === 'string') {
                throw new BadRequestError(`Error fetching grocery items: ${error}`);
            } else {
                throw new BadRequestError('Error fetching grocery items: Unknown error occurred');
            }
        }
    }

    // Remove grocery item
    async removeGroceryItem(itemId: number): Promise<void> {
        try {
            const item = await this.groceryItemRepo.findOneBy({ id: itemId });
            if (!item) {
                throw new NotFoundError(`Grocery item with ID ${itemId} not found`);
            }
            await this.groceryItemRepo.remove(item);
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new BadRequestError(`Error removing grocery item: ${error.message}`);
            } else if (typeof error === 'string') {
                throw new BadRequestError(`Error removing grocery item: ${error}`);
            } else {
                throw new BadRequestError('Error removing grocery item: Unknown error occurred');
            }
        }
    };

    //Update grocery item
    async updateGroceryItem(itemId: number, updateData: Partial<GroceryItem>): Promise<GroceryItem> {
        try {
            const item = await this.groceryItemRepo.findOneBy({ id: itemId });
            if (!item) {
                throw new NotFoundError(`Grocery item with ID ${itemId} not found`);
            }
            Object.assign(item, updateData);
            return await this.groceryItemRepo.save(item);
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new BadRequestError(`Error updating grocery item: ${error.message}`);
            } else if (typeof error === 'string') {
                throw new BadRequestError(`Error updating grocery item: ${error}`);
            } else {
                throw new BadRequestError('Error updating grocery item: Unknown error occurred');
            }
        }
    }

    // Update inventory
    async updateInventory(itemId: number, quantityInStock: number): Promise<GroceryItem> {
        return await this.updateGroceryItem(itemId, { quantityInStock });
    }

    async getAvailableGroceryItems(): Promise<GroceryItem[]> {
        try {
            return await this.groceryItemRepo.find({
                where: {
                    quantityInStock: MoreThan(0)
                },
                order: { name: 'ASC' }
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new BadRequestError(`Error fetching available grocery items: ${error.message}`);
            } else if (typeof error === 'string') {
                throw new BadRequestError(`Error fetching available grocery items: ${error}`);
            } else {
                throw new BadRequestError('Error fetching available grocery items: Unknown error occurred');
            }
        }
    }

}

