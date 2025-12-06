import { vehicleServices } from "./vehicle.service";
import { Request, Response } from "express";

const addVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.addVehicle(req.body);
    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();
    // console.log(result.rows[0]);
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await vehicleServices.getSingleVehicle(id as string);
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result.rows[0],
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
        details: err,
      });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
     // console.log(req.params.id);
      const { id } = req.params;
      try {
        const result = await vehicleServices.UpdateVehicle(req.body, id as string);
    
        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Vehicle not found",
          });
        }
        res.status(200).json({
          success: true,
          message: "Vehicle updated successfully",
          data: result.rows[0],
        });
      } catch (err: any) {
        res.status(500).json({
          success: false,
          message: err.message,
          details: err,
        });
      }
}



const deleteVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await vehicleServices.deleteVehicle(id as string);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
}



export const vehicleControllers = {
  addVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
