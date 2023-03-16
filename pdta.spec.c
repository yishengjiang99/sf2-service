#include "pdta.c"
#include <assert.h>
#include <stdio.h>
#include "sf2.h"
void emitHeader(int pid, int n, void *p)
{
    phdr *pset = (phdr *)p;   
    printf("\n=Header: %s %d %d", pset->name,pset->pid,n);

}
void emitZone(int pid, void *ref)
{
    zone_t *zone = (zone_t *)ref;
    shdrcast *shdr = (shdrcast *)(shdrs + zone->SampleId);
    printf("\n\t- key: %d-%d \tInst: %d", zone->KeyRange.lo,zone->KeyRange.hi, zone->SampleId);
    printf("\t\toffsets: %d-%d", zone->StartAddrOfs, zone->EndAddrOfs);

}
void emitSample(int id, int pid, void* name)
{    
  printf("\n\t- sample id: %d pid %d, %s",id, pid,name);

}
void emitFilter(int type, uint8_t lo, uint8_t hi) {}

int main()
{
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

    zone_t *pt = presets[0];
    for(int i=0; pt[i].SampleId!=-1; i++){
        printf("\n%d %d %d",i, pt[i].Instrument,  pt[i].SampleId);
    }
    return 0;
}