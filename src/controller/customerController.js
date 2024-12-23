// src/controller/customerController.js
import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
const { Customer } = db;

export const createCustomer = async (req, res) => {
    try {
        const { name, phone, email, balance, lastTransaction } = req.body;
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({ status: 'error', message: 'User id is required' });
        }
        const newCustomer = await Customer.create({ name, phone, email, balance, lastTransaction, userId });
        res.status(200).json({ status: 'success', data: newCustomer });
    } catch (error) {
        console.error('Create customer error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { name, phone, email, balance, lastTransaction } = req.body;
        const userId = req.user.id;
        console.log("uuid:",uuid,req.body);
        if (!userId) {
            return res.status(400).json({ status: 'error', message: 'User id is required' });
        }
        const customer = await Customer.findOne({ where: { uuid, userId } });
        if (!customer) {
            return res.status(404).json({ status: 'error', message: 'Customer not found' });
        }
        await customer.update({ name, phone, email, balance, lastTransaction });
        res.status(200).json({ status: 'success', data: customer });
    } catch (error) {
        console.error('Update customer error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const { uuid } = req.params;
        const userId = req.user.id;
        console.log("uuid:-",req.params);
        if (!userId) {
            return res.status(400).json({ status: 'error', message: 'User id is required' });
        }
        const customer = await Customer.findOne({ where: { uuid, userId } });
        if (!customer) {
            return res.status(404).json({ status: 'error', message: 'Customer not found' });
        }
        await customer.destroy();
        res.status(200).json({ status: 'success', message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const getCustomer = async (req, res) => {
    try {
        const { uuid } = req.params;
        const userId = req.user.id;
        if (uuid) {
            const customer = await Customer.findByPk({ where: { uuid, userId } });
            if (!customer) {
                return res.status(404).json({ status: 'error', message: 'Customer not found' });
            }
            return res.status(200).json({ status: 'success', data: customer });
        } else {
            if(!userId){
                return res.status(400).json({ status: 'error', message: 'User id is required' });
            }
            const customers = await Customer.findAll({ where: { userId } });
            return res.status(200).json({ status: 'success', data: customers });
        }
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};