// seed.js
// require('dotenv').config();
// const mongoose = require('mongoose');

// const University = require('./models/university.model');
// const Department = require('./models/department.model');
// const User = require('./models/user.model');
// const ItemCategory = require('./models/itemCategory.model');
// const Item = require('./models/item.model');

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import University from "./models/university.model.js";
import Department from "./models/department.model.js";
import User from "./models/user.model.js";
import ItemCategory from "./models/itemCategory.model.js";
import Item from "./models/item.model.js";


const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/uni-demand';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Purana data clean karna (optional)
    await Promise.all([
      University.deleteMany({}),
      Department.deleteMany({}),
      User.deleteMany({}),
      ItemCategory.deleteMany({}),
      Item.deleteMany({})
    ]);
    console.log('🧹 Old data cleared');

    // ---------- Universities ----------
    const uni1 = await University.create({
      name: 'ABC University',
      code: 'ABCU',
      city: 'Delhi',
      state: 'Delhi',
      contactEmail: 'info@abcu.edu'
    });

    const uni2 = await University.create({
      name: 'XYZ University',
      code: 'XYZU',
      city: 'Mumbai',
      state: 'Maharashtra',
      contactEmail: 'info@xyzu.edu'
    });

    // ---------- Departments ----------
    const cseDept = await Department.create({
      university: uni1._id,
      name: 'Computer Science',
      code: 'CSE',
      hodName: 'Dr. Sharma',
      contactEmail: 'cse@abcu.edu'
    });

    const mechDept = await Department.create({
      university: uni1._id,
      name: 'Mechanical Engineering',
      code: 'ME',
      hodName: 'Dr. Verma',
      contactEmail: 'mech@abcu.edu'
    });

    const physicsDept = await Department.create({
      university: uni2._id,
      name: 'Physics',
      code: 'PHY',
      hodName: 'Dr. Rao',
      contactEmail: 'phy@xyzu.edu'
    });

    // ---------- Users (demo) ----------
    const superAdmin = await User.create({
      university: uni1._id,
      name: 'Super Admin',
      email: 'admin@uni.com',
      passwordHash: '123456', // demo ke liye plain; actual me hash use karna
      role: 'super_admin'
    });

    const cseUser = await User.create({
      university: uni1._id,
      department: cseDept._id,
      name: 'CSE Department User',
      email: 'cseuser@uni.com',
      passwordHash: '123456',
      role: 'department_user'
    });

    console.log('👤 Users created:', superAdmin.email, cseUser.email);

    // ---------- Item Categories ----------
    const stationeryCat = await ItemCategory.create({
      name: 'Stationery',
      description: 'Office and exam related items'
    });

    const electronicsCat = await ItemCategory.create({
      name: 'Electronics',
      description: 'Electronic devices and accessories'
    });

    const labCat = await ItemCategory.create({
      name: 'Lab Equipment',
      description: 'Laboratory related items'
    });

    // ---------- Items (products) ----------
    const items = await Item.insertMany([
      {
        category: stationeryCat._id,
        name: 'A4 Paper Rim',
        description: '500 sheets pack',
        unit: 'rim',
        defaultPrice: 300,
        image: 'a4_paper.png' // /images/a4_paper.png (React public folder)
      },
      {
        category: stationeryCat._id,
        name: 'Whiteboard Marker',
        description: 'Black color marker',
        unit: 'pcs',
        defaultPrice: 25,
        image: 'marker_black.png'
      },
      {
        category: stationeryCat._id,
        name: 'Ball Pen (Blue)',
        description: 'Pack of 20 pens',
        unit: 'box',
        defaultPrice: 120,
        image: 'blue_pen_box.png'
      },
      {
        category: electronicsCat._id,
        name: 'Projector',
        description: 'Classroom projector',
        unit: 'pcs',
        defaultPrice: 25000,
        image: 'projector.png'
      },
      {
        category: labCat._id,
        name: 'Beaker 250ml',
        description: 'Glass beaker for lab',
        unit: 'pcs',
        defaultPrice: 80,
        image: 'beaker_250.png'
      }
    ]);

    console.log(`📦 Items inserted: ${items.length}`);
    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
