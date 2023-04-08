#include "pdta.c"

#include <assert.h>
#include <stdio.h>
void emitHeader(int pid, int bid, void *p) { phdr *pset = (phdr *)p; }
void emitZone(int pid, void *ref) {
  zone_t *zone = (zone_t *)ref;
  shdrcast *shdr = (shdrcast *)(shdrs + zone->SampleId);
}
void emitSample(int id, int pid, void *name) {
  // printf("\n\tsample id: %d pid %d, %s",id, pid,name);
}
void emitFilter(int type, uint8_t lo, uint8_t hi) {}

int main() {
  printf("hello\n");
  char *filename = "file.sf2";

  FILE *fd = fopen(filename, "r");
  sheader_t *header = (sheader_t *)malloc(sizeof(sheader_t));
  header2_t *h2 = (header2_t *)malloc(sizeof(header2_t));
  fread(header, sizeof(sheader_t), 1, fd);
  printf("%.4s %.4s %.4s %u", header->name, header->sfbk, header->list,
         header->size);
  fread(h2, sizeof(header2_t), 1, fd);
  printf("\n%.4s %u", h2->name, h2->size);
  fseek(fd, h2->size, SEEK_CUR);
  fread(h2, sizeof(header2_t), 1, fd);
  printf("\n%.4s %u", h2->name, h2->size);
  fseek(fd, h2->size, SEEK_CUR);
  fread(h2, sizeof(header2_t), 1, fd);
  printf("\n%.4s %u", h2->name, h2->size);
  char *pdtabuffer = malloc(h2->size);
  fread(pdtabuffer, h2->size, h2->size, fd);

  loadpdta(pdtabuffer);
  phdr *phr = findPreset(0, 0);
  findPresetZonesCount(phr);
  findPresetZones(phr, findPresetZonesCount(phr));
  return 1;
  phr = findPreset(0, 0);
  findPresetZonesCount(phr);
  findPresetZones(phr, findPresetZonesCount(phr));
  for (int i = 0; i < 127; i += 1) {
    phr = findPreset(i, 0);

    printf("\n****\n%s %d %p\n***", phr->name, phr->pid, phr);
    // phr = findPreset(i, 0);
    if (!phr) continue;

    findPresetZonesCount(phr);
    findPresetZones(phr, findPresetZonesCount(phr));
  }
  return 1;
}