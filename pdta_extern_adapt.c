#include "sf2.h"
void emitHeader(int pid, int bid, void *p) {
  phdr *pset = (phdr *)p;
  printf("\n\nheader %s %d %d", pset->name, pid, bid);
}
void emitZone(int pid, void *ref) { zone_t *zone = (zone_t *)ref; }
void emitSample(int id, int pid, void *name) {
  // printf("\n\tsample id: %d pid %d, %s",id, pid,name);
}
void emitFilter(int type, uint8_t lo, uint8_t hi) {}