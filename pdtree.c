
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

#include "pdta.c"
#include "pdta_extern_adapt.c"
#include "sf2.h"

typedef struct {
  pgen *pdef;
  uint16_t n_pzones;
  pgen **pzones;
  igen *idef;
  uint32_t n_izones;
  igen **izones;
} ptree;

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
  readpdta(pdtabuffer);
  printf("%d", nphdrs);
  phdr *ph = findPreset(0, 0);
  printf("%s,", ph->name);
}

typedef struct _gset {
  pgen *pg;
  struct _gset *next;
} gset;

ptree *mktree(ptree *t, phdr *phr) {
  pbag *defbag = pbags + phr->pbagNdx;
  pbag *lastbag = pbags + (phr + 1)->pbagNdx;
  pgen **pgs;
  gset pset[1];
  pgen **trace = pgs;
  for (pbag *pg = defbag; pg < lastbag; pg++) {
    trace = &pg;
  }
}
/**
 *
 * pgen
 * pgen
 *
 * pgen filter
 * pgen
 * pgen ibagRef
 *
 * pgen filter
 * pgen
 * pgen ibagRef
 * ..
 * ..
 * igen global
 * igen
 * igen
 *
 * igen filter
 * igen
 * igen sample
 *
 * igen filter
 * igen
 * igen sample
 *
 *
 *
 *
 *
 *
 *
 *  1.defbag
 * 	2. pbag
 *
 * 	3. pbag
 *
 *
 *
 */