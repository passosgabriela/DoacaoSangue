import { Appointment } from "../models/Appointment.js";

export const appointmentController = {
  create: async (req, res) => {
    try {
      const { data_agendamento, horario } = req.body;
      const userId = req.userId; // vem do middleware auth

      const id = await Appointment.create([
        userId,
        data_agendamento,
        horario,
      ]);

      res.json({ message: "Agendamento criado", id });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  listByUser: async (req, res) => {
    try {
      const userId = req.userId;
      const agendamentos = await Appointment.findByUser(userId);

      res.json(agendamentos);

    } catch (err) {
      res.status(500).json(err);
    }
  }
};
