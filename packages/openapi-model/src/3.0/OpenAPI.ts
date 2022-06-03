import { Components } from './Components';
import { ExternalDocumentation } from './ExternalDocumentation';
import { Info } from './Info';
import { PathItem } from './PathItem';
import { Paths } from './Paths';
import { SecurityRequirement } from './SecurityRequirement';
import { Server as ServerImpl } from './Server';
import { Tag } from './Tag';

import type {
  OpenApiVersion,
  IOpenAPI,
  ParametrisedURLString,
  IServer,
  IPathItem,
  ITag,
} from './types';
import type { CommonMarkString, Nullable, VersionString, JSONValue } from '@fresha/api-tools-core';

/**
 * @see http://spec.openapis.org/oas/v3.0.3#openapi-object
 */
export class OpenAPI implements IOpenAPI {
  readonly openapi: OpenApiVersion;
  info: Info;
  servers: ServerImpl[];
  paths: Paths;
  components: Components;
  security: Nullable<SecurityRequirement>;
  tags: Tag[];
  externalDocs: Nullable<ExternalDocumentation>;
  readonly extensionFields: Map<string, JSONValue>;

  constructor(title: string, version: VersionString) {
    this.openapi = '3.0.3';
    this.info = new Info(this, title, version);
    this.servers = [];
    this.paths = new Paths(this);
    this.components = new Components(this);
    this.security = null;
    this.tags = [];
    this.externalDocs = null;
    this.extensionFields = new Map<string, JSONValue>();
  }

  get root(): OpenAPI {
    return this;
  }

  addServer(
    url: ParametrisedURLString,
    variableDefaults?: Record<string, string>,
    description?: CommonMarkString,
  ): IServer {
    if (this.servers.find(server => server.url === url)) {
      throw new Error(`Duplicate server URL ${url}`);
    }

    const server = new ServerImpl(this, url, variableDefaults);
    if (description) {
      server.description = description;
    }
    this.servers.push(server);
    return server;
  }

  removeServerAt(index: number): void {
    this.servers.splice(index, 1);
  }

  clearServers(): void {
    this.servers.splice(0, this.servers.length);
  }

  addPathItem(url: ParametrisedURLString): IPathItem {
    if (this.paths.items.has(url)) {
      throw new Error(`Duplicate path item ${url}`);
    }
    const pathItem = new PathItem(this.paths);
    this.paths.items.set(url, pathItem);
    return pathItem;
  }

  removePathItem(url: ParametrisedURLString): void {
    this.paths.delete(url);
  }

  clearPathItems(): void {
    this.paths.clear();
  }

  addTag(name: string): ITag {
    if (this.tags.find(tag => tag.name === name)) {
      throw new Error(`Duplicate tag ${name}`);
    }
    const tag = new Tag(this, name);
    this.tags.push(tag);
    return tag;
  }

  removeTag(name: string): void {
    const index = this.tags.findIndex(tag => tag.name === name);
    if (index >= 0) {
      this.removeTagAt(index);
    }
  }

  removeTagAt(index: number): void {
    this.tags.splice(index, 1);
  }

  clearTags(): void {
    this.tags.splice(0, this.tags.length);
  }
}
