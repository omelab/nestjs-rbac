import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SlugProvider {
  private client: PrismaClient = new PrismaClient();

  private generateSlug(text: string): string {
    const asciiText = text
      .toString() // Ensure input is a string
      .toLowerCase() // Convert to lowercase
      .trim() // Remove any leading/trailing whitespace
      .normalize('NFD') // Normalize to decomposed form
      .replace(/<(?:.|\n)*?>/gm, '')
      .replace(/[$\-_.+!*'(), "<>#%{}|^~[\]` ;/?:@=&]/g, ' ')
      .trim()
      .replace(/\s+/g, '-');
    return asciiText;
  }

  private replacement(): string {
    return '-';
  }

  async slugify(
    title: string,
    module: string,
    id: number = null,
  ): Promise<string> {
    const slug = this.generateSlug(title);
    const where: any = { slug: { startsWith: slug } };

    if (id) {
      where.id = { not: id };
    }

    const exists = await this.client[module].findMany({ where });

    // if slug doesn't already exists
    if (!exists || exists.length === 0) {
      return slug;
    }

    // Omit if same entity
    if (exists.length === 1 && id === exists[0].id) {
      return slug;
    }

    return slug + this.replacement() + exists.length;
  }
}
