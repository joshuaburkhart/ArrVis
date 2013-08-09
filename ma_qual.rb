#!/usr/bin/ruby

#Usage: ma_qual.rb <ma data file> <q value lim> <keep low quality rows> <use stdout>

#Example: ma_qual.rb limma.KC-WI.gene.de.txt 0.05 false true

#NOTE: This program produces the the output file described below if stdout is unused.
#
#~.qual.csv => file containing rows with specified ma expression levels

DerivedDataRow = Struct.new(:gene,:minus,:avg,:diff,:t,:pvalue,:qvalue,:sig,:b)
Q_LIM_DEFAULT = 0.05

ma_filename = ARGV[0]
q_lim = Q_LIM_DEFAULT
keep_low_quals = false
use_stdout = false
if(ARGV.size >= 2)
    q_lim = Float(ARGV[1])
    if(ARGV.size >= 3)
        keep_low_quals = ARGV[2]
        if(ARGV.size <= 4 && ARGV[3] = "true")
            use_stdout = true
        else
            puts "Error: Incorrect # args supplied. (#{ARGV.size} for 4)"
        end
    end
end
ma_filehandl = File.open(ma_filename,"r")
ma_header = ma_filehandl.gets
ma_results = Array.new

if(!use_stdout)
    puts "reading #{ma_filename}..."
end
line_count = 0
while(ma_dataline = ma_filehandl.gets)
    if(!use_stdout && line_count % 1000 == 0)
        print "."
        $stdout.flush
    end
    ma_dataline_ary = ma_dataline.split(/\s/)

    gene = ma_dataline_ary[0]
    minus = Float(ma_dataline_ary[1])
    avg = Float(ma_dataline_ary[2])
    t = Float(ma_dataline_ary[3])
    pvalue = Float(ma_dataline_ary[4])
    qvalue = Float(ma_dataline_ary[5])
    b = Float(ma_dataline_ary[6])

    diff = minus - avg
    sig = qvalue < q_lim

    ma_results << DerivedDataRow.new(gene,minus,avg,diff,t,pvalue,qvalue,sig,b)

    line_count += 1
end

ma_filehandl.close

ma_results.sort! { |i,j|
    j.minus.abs <=> i.minus.abs
}

if(!use_stdout)
    qual_filehandl = File.open("#{ma_filename}.qual.csv","w")
end

out_header = "Gene\tMinus\tAverage\tDifference\tt-value\tp-value\tq-value\tsignificant\tB"

if(use_stdout)
    $stdout.puts out_header
else
    qual_filehandl.puts(out_header)
    puts "writing results..."
end

ma_results.each { |i|
    if(i.sig == true || "#{i.sig}" != keep_low_quals)
        pretty_string = "#{i.gene}\t#{i.minus}\t#{i.avg}\t#{i.diff}\t#{i.t}\t#{i.pvalue}\t#{i.qvalue}\t#{i.sig}\t#{i.b}"
        if(use_stdout)
            $stdout.puts pretty_string
        else
            qual_filehandl.puts(pretty_string)
        end
    end
}

if(!use_stdout)
    qual_filehandl.close
    puts "done."
end

