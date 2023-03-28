#include <stdio.h>
#include <stdlib.h>

#include "pdta.c"
#include "sf2.h"
void emitHeader(int pid, int bid, void *p) {}
void emitZone(int pid, void *ref) {}
void emitSample(int id, int pid, void *p) {}
void emitFilter(int type, uint8_t lo, uint8_t hi) {}

int main() {
  FILE *fd = fopen("pdta.dat", "r");
  ftell(fd);
  char buf[]
}
int skipmain() {
  FILE *fd = fopen("file.sf2", "r");
  sheader_t *header = (sheader_t *)malloc(sizeof(sheader_t));
  header2_t *h2 = (header2_t *)malloc(sizeof(header2_t));
  fread(header, sizeof(sheader_t), 1, fd);
  fread(h2, sizeof(header2_t), 1, fd);
  printf("\n%.4s %u", h2->name, h2->size);
  info = malloc(h2->size);
  fread(info, h2->size, 1, fd);
  fread(h2, sizeof(header2_t), 1, fd);
  printf("\n%.4s %u", h2->name, h2->size);
  data = (short *)malloc(h2->size / 2 * sizeof(short));
  sdta = (float *)malloc(h2->size / 2 * sizeof(float));
  float *trace = sdta;
  nsamples = h2->size / sizeof(short);

  printf("\n\t %ld", ftell(fd));
  //  fread(data, sizeof(short), nsamples, fd);
  fseek(fd, 2 * nsamples, SEEK_CUR);

  section_header *sh = (section_header *)malloc(sizeof(section_header));

  fread(h2, sizeof(header2_t), 1, fd);
  printf("%.4s %u \n", h2->name, h2->size);
  FILE *fd2 = fopen("pdta.dat", "w");
  char pdtab[h2->size];
  fread(pdtab, h2->size, 1, fd);
  fwrite(pdtab, h2->size, 1, fd2);
  fclose(fd2);
  fclose(fd);
  return 0;
}