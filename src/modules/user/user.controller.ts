import { Request, Response } from "express";
import { userServices } from "./user.service";




const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
}

const getSingleUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  const { id } = req.params;
  try {
    const result = await userServices.getSingleUser(id as string);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
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

const updateUser =  async (req: Request, res: Response) => {
  // console.log(req.params.id);
  const { id } = req.params;
  try {
    const result = await userServices.updateUser(req.body, id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userServices.deleteUser(id as string);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
}




export const userController = {
  getUser,
  getSingleUser,
  updateUser,
  deleteUser

};