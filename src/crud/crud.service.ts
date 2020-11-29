import { Document, Model } from "mongoose";

export class CrudService {
  constructor(protected model: Model<Document>) { }

  async createOne(body: any) {
    return this.model.create(body)
  }

  async createMany(bodies: any[]) {
    return this.model.create(bodies)
  }

  async findById(id: string) {
    return this.model.findById(id).lean().exec()
  }

  async findMany(filter: any, limit: number, skip: number, sort: string[], select: string[]) {
    return this.model.find(filter).limit(limit).skip(skip).sort(sort).select(select).lean().exec()
  }

  async updateById(id: string, query: any) {
    return this.model.updateOne({ _id: id }, query).exec()
  }

  async updateMany(filter: any, query: any) {
    return this.model.updateMany(filter, query).exec()
  }

  async deleteById(id: string) {
    return this.model.deleteOne({ _id: id }).exec()
  }

  async deleteMany(ids: string[]) {
    return this.model.deleteMany({ _id: ids }).exec()
  }
}
