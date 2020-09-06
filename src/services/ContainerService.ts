import { Container } from "@arkecosystem/core-interfaces";
import { Plugins } from "../types";

export default class ContainerService {
  private static container: Container.IContainer;

  private constructor() {}

  static setContainer(logger: Container.IContainer) {
    ContainerService.container = logger;
  }

  static getContainer(): Container.IContainer {
    return ContainerService.container;
  }

  static resolve<T>(plugin: Plugins): T {
    return ContainerService.container.resolvePlugin<T>(plugin);
  }
}
