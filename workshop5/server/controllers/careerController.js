const Career = require("../models/careerModel");

const careerPost = (req, res) => {
    let career = new Career();
    career.name = req.body.name;
    career.code = req.body.code;
    career.description = req.body.description;
    career
        .save()
        .then(() => {
            res.status(201);
            res.header({
                location: `/api/career/?id=${career.id}`,
            });
            res.json(career);
        })
        .catch((err) => {
            res.status(422);
            console.log("error", err);
            res.json({
                error: "error",
            });
        });
};

const careerGet = (req, res) => {
    if (req.query && req.query.id) {
        Career.findById(req.query.id)
            .then((career) => {
                res.json(career);
            })
            .catch((err) => {
                res.status(404);
                console.log("error", err);
                res.json({ error: "Career does not exist" });
            });
    } else {
        let query = {};
        if (req.query.name) {
            query.name = new RegExp(req.query.name, 'i'); // Filtrar por nombre (insensible a mayúsculas/minúsculas)
        }

        let sort = {};
        if (req.query.sort) {
            sort.name = req.query.sort === 'asc' ? 1 : -1; // Ordenar alfabéticamente
        }

        Career.find(query).sort(sort)
            .then((career) => {
                res.json(career);
            })
            .catch((err) => {
                res.status(433);
                res.json({ error: err });
            });
    }
};

const careerPut = async (req, res) => {
    if (req.query && req.query.id) {
        const careerId = req.query.id;

        try {
            const updatedCareer = await Career.findByIdAndUpdate(
                careerId,
                {
                    $set: {
                        name: req.body.name,
                        code: req.body.code,
                        description: req.body.description,
                    },
                },
                { new: true, runValidators: true }
            );

            if (!updatedCareer) {
                return res.status(404).json({ error: "Career doesn't exist" });
            }

            return res.status(200).json(updatedCareer);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: 'error' });
        }
    }
};

async function careerDelete(req, res) {
    if (req.query && req.query.id) {
        try {
            const career = await Career.findById(req.query.id);
            if (!career) {
                return res.status(404).json({ error: "Career does not exist" });
            }

            await Career.deleteOne({ _id: req.query.id });
            return res.status(204).json({});
        } catch (err) {
            console.error("Error while handling the career:", err);
            return res.status(500).json({ error: "There was an error processing the career" });
        }
    } else {
        return res.status(400).json({ error: "No ID provided" });
    }
}

module.exports = {
    careerPost,
    careerGet,
    careerPut,
    careerDelete
};
