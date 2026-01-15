const mongoose = require('mongoose');

const CanvasSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },

    elements: {
      type: [{ type: mongoose.Schema.Types.Mixed }],
      default: [],
    },

    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
  },
  {
    timestamps: true,
  }
);


CanvasSchema.statics.getAllCanvases = async function (email) {
  try {
    const user = await mongoose.model('Users').findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const userId = user._id;

    const canvases = await this.find({
      $or: [
        { owner: userId },
        { sharedWith: userId },
      ],
    });

    return canvases;
  } catch (error) {
    throw new Error(error.message);
  }
};


CanvasSchema.statics.createCanvas = async function (email, name) {
  try {
    const user = await mongoose.model('Users').findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const canvas = await this.create({
      owner: user._id,
      name,
      elements: [],
      sharedWith: [],
    });

    return canvas;
  } catch (error) {
    throw new Error(error.message);
  }
};

CanvasSchema.statics.loadCanvas = async function (email, canvasId) {
  try {
    const user = await mongoose.model('Users').findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const canvas = await this.findOne({
      _id: canvasId,
      $or: [
        { owner: user._id },
        { sharedWith: user._id },
      ],
    });

    if (!canvas) {
      throw new Error('Canvas not found or access denied');
    }

    return canvas;
  } catch (error) {
    throw new Error(error.message);
  }
};

CanvasSchema.statics.updateCanvas = async function (email, canvasId, elements) {
  try {
    const user = await mongoose.model('Users').findOne({ email });
    if (!user) throw new Error('User not found');

    const canvas = await this.findOne({
      _id: canvasId,
      $or: [{ owner: user._id }, { sharedWith: user._id }],
    });

    if (!canvas) {
      throw new Error('Canvas not found or access denied');
    }

    const safeElements = elements.map(el =>
      JSON.parse(JSON.stringify(el))
    );

    canvas.elements = safeElements;
    return await canvas.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

CanvasSchema.statics.shareCanvas = async function (email, canvasId, sharedWithEmail) {
  try {
    const user = await mongoose.model('Users').findOne({ email });
    const sharedWithUser = await mongoose.model('Users').findOne({email: sharedWithEmail});
    if (!user) throw new Error('User not found');

    const canvas = await this.findOne({
      _id: canvasId,
      $or: [{ owner: user._id }, { sharedWith: user._id }],
    });

    if (!canvas) {
      throw new Error('Canvas not found or access denied');
    }

   canvas.sharedWith.push(sharedWithUser._id);
   const updateCanvas = await canvas.save();
   return updateCanvas;
  } catch (error) {
    throw new Error(error.message);
  }
};




const Canvas = mongoose.model('Canvas', CanvasSchema);
module.exports = Canvas;
