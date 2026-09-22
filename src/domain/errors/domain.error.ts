/**
 * CAPA: Domain (núcleo azul)
 * ROL:  Error de negocio. HTTP lo traduce el filter.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
