import db from '../models/index.js';

const { Services } = db;

// ✅ Create a Service
export const createService = async (req, res) => {
    try {
        const { name, description, category, price, isActive, service_No, sac, gst, total_Sprice } = req.body;
        const user_providerId = req.user.id;

        if (!user_providerId) {
            return res.status(400).json({ status: 'error', message: 'User ID is required' });
        }

        const newService = await Services.create({
            name, description, category, price, isActive, user_providerId, service_No, sac, gst,total_Sprice, createdBy: user_providerId
        });

        res.status(201).json({ status: 'success', data: newService });
    } catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// ✅ Update a Service
export const updateService = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { name, description, category, price, isActive, service_No, sac, gst,total_Sprice } = req.body;
        const user_providerId = req.user.id;

        if (!user_providerId) {
            return res.status(400).json({ status: 'error', message: 'User ID is required' });
        }

        const service = await Services.findOne({ where: { uuid, user_providerId } });
        if (!service) {
            return res.status(404).json({ status: 'error', message: 'Service not found' });
        }

        await service.update({ name, description, category, price, isActive, service_No, sac, gst,total_Sprice, updatedBy: user_providerId });

        res.status(200).json({ status: 'success', data: service });
    } catch (error) {
        console.error('Update service error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// ✅ Delete a Service
export const deleteService = async (req, res) => {
    try {
        const { uuid } = req.params;
        const user_providerId = req.user.id;

        if (!user_providerId) {
            return res.status(400).json({ status: 'error', message: 'User ID is required' });
        }

        const service = await Services.findOne({ where: { uuid, user_providerId } });
        if (!service) {
            return res.status(404).json({ status: 'error', message: 'Service not found' });
        }

        await service.destroy();

        res.status(200).json({ status: 'success', message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Delete service error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// ✅ Get Service(s)
export const getService = async (req, res) => {
    try {
        const { uuid } = req.params;
        const user_providerId = req.user.id;

        if (uuid) {
            const service = await Services.findOne({ where: { uuid, user_providerId } });
            if (!service) {
                return res.status(404).json({ status: 'error', message: 'Service not found' });
            }
            return res.status(200).json({ status: 'success', data: service });
        } else {
            const services = await Services.findAll({ where: { user_providerId } });
            return res.status(200).json({ status: 'success', data: services });
        }
    } catch (error) {
        console.error('Get service error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
