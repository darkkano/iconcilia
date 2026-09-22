import { Injectable } from '@nestjs/common';
import { Document } from '../../domain/entities/document.js';
import type { DocumentRepositoryPort } from '../../domain/ports/document-repository.port.js';

@Injectable()
export class InMemoryDocumentRepository implements DocumentRepositoryPort {
  private readonly store = new Map<string, Document>();

  async save(doc: Document): Promise<void> {
    this.store.set(doc.id, doc);
  }

  async findById(id: string): Promise<Document | null> {
    return this.store.get(id) ?? null;
  }

  async list(): Promise<Document[]> {
    return [...this.store.values()].reverse();
  }
}
