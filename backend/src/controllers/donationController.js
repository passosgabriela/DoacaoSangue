import { Donation } from "../models/Donation.js";

export const donationController = {

  register: async (req, res) => {
    try {
      const { usuario_id, data_doacao, volume_coletado, tipo_sanguineo } = req.body;

      const id = await Donation.create([
        usuario_id,
        data_doacao,
        volume_coletado,
        tipo_sanguineo
      ]);

      res.json({ message: "Doação registrada", id });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  listByUser: async (req, res) => {
    try {
      const userId = req.userId; // do token
      const doacoes = await Donation.findByUser(userId);

      res.json(doacoes);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
