import {
  Directive,
  HostListener,
  EventEmitter,
  Output,
  HostBinding,
} from '@angular/core';

import {
  DomSanitizer, SafeUrl
} from '@angular/platform-browser';

export interface FileHandle {
  file: File,
  url: SafeUrl
}


@Directive({
  selector: '[appImageDrag]',
})
export class ImageDragDirective {
  @Output('files') files: EventEmitter < FileHandle[] > = new EventEmitter();
  @HostBinding('style.background') public background = '#eaecf466';
  @HostBinding('style.padding') public padding = '0';
  @HostBinding('style.opacity') public opacity = '1';
  constructor(private sanitizer: DomSanitizer) {}
  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#eaecf466';
      this.padding = '15px';
      this.opacity = '0.4';
  }
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#eaecf466';
      this.padding = '0px';
      this.opacity = '1';
  }
  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#e3e6f0';
      this.padding = '0px';
      this.opacity = '1';
      let files: FileHandle[] = [];
      for (let i = 0; i < evt.dataTransfer.files.length; i++) {
          const file = evt.dataTransfer.files[i];
          const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
          files.push({
              file,
              url
          });
      }
      if (files.length > 0) {
          this.files.emit(files);
      }
  }
}
