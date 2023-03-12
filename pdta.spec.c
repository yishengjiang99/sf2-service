#include "pdta.c"
#include <assert.h>
#include <stdio.h>
void emitHeader(int pid, int bid, void *p)
{
    phdr *pset = (phdr *)p;
// printf("\nheader %20s\n", pset->name);
}
void emitZone(int pid, void *ref)
{
    zone_t *zone = (zone_t *)ref;
    shdrcast *shdr = (shdrcast *)(shdrs + zone->SampleId);
    printf("\t v %d %d k %u %u", zone->VelRange.lo, zone->VelRange.hi, zone->KeyRange.lo, zone->KeyRange.hi);
    printf("\t sampleID %d %d %d\n", zone->SampleId, zone->Attenuation, zone->FilterFc);
}
void emitSample(void *ref, int start, int len)
{
    shdrcast *shdr = (shdrcast *)ref;
    //   printf("\t\t sample id: %s %d\n", shdr->name, shdr->start);
}
void emitFilter(int type, uint8_t lo, uint8_t hi) {}
int main()
{
    printf("hello\n");
    char *filename = "test.sf2";

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

    printf("\n");
    return 1;
}