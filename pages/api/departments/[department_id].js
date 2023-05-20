import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    try {
      const user_id = req.body.user_id.split('|')[1];
      const department_id = req.query.department_id;
      const client = await clientPromise;
      const response = await client
        .db('logistie')
        .collection('departments')
        .updateOne(
          { _id: new ObjectId(department_id) },
          { $push: { employees: new ObjectId(user_id) } }
        );

      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('logistie');
      if (!req.query.department_id) res.status(400).json({ error: 'department_id is required' });

      const department_id = req.query.department_id;

      const result = await db
        .collection('departments')
        // .findOne({ _id: new ObjectId(department_id) });
        .aggregate([
          {
            $match: {
              _id: new ObjectId(department_id),
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'employees',
              foreignField: '_id',
              as: 'employees',
            },
          },
        ])
        .project({ 'employees.password': 0 })
        .toArray();

      const department = result[0];

      department.titles.forEach((title) => {
        title.number_of_employees = department.employees.filter(
          (employee) => employee.user_metadata.title === title.name
        ).length;
      });

      res.status(200).json(department);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
