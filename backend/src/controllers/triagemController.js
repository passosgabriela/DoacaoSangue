import { Triagem } from "../models/Triagem.js";

export const triagemController = {

  registrar: async (req, res) => {
    try {
      const {
        agendamento_id,
        pressao,
        batimentos,
        temperatura,
        observacoes,
        status
      } = req.body;

      const profissional_id = req.profissionalId; // profissional logado

      const id = await Triagem.create([
        agendamento_id,
        profissional_id,
        pressao,
        batimentos,
        temperatura,
        observacoes,
        status
      ]);

      res.json({ message: "Triagem registrada", id });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  porAgendamento: async (req, res) => {
    try {
      const { id } = req.params; // id do agendamento
      const triagem = await Triagem.findByAppointment(id);

      res.json(triagem || {});
    } catch (err) {
      res.status(500).json(err);
    }
  },

  all: async (req, res) => {
    try {
      const rows = await Triagem.listAll();
      res.json(rows);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
